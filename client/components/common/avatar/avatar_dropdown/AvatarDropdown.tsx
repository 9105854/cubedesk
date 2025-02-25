import React from 'react';
import Dropdown, {DropdownProps} from '../../inputs/dropdown/Dropdown';
import {copyText} from '../../copy_text/CopyText';
import {toastSuccess} from '../../../../util/toast';
import {openModal} from '../../../../actions/general';
import UserView from '../../../admin/manage_user/ManageUser';
import {useDispatch} from 'react-redux';
import {PublicUserAccount, UserAccount, UserAccountForAdmin} from '../../../../../server/schemas/UserAccount.schema';
import ReportUser from '../../../profile/report/ReportUser';
import EditProfile from '../../../profile/edit_profile/EditProfile';
import {useMe} from '../../../../util/hooks/useMe';

interface Props {
	mini?: boolean;
	user: UserAccountForAdmin | PublicUserAccount | UserAccount;
	dropdownProps?: DropdownProps;
}

export default function AvatarDropdown(props: Props) {
	const {user, mini, dropdownProps} = props;

	const me = useMe();
	const dispatch = useDispatch();

	const amAdmin = me?.admin;
	const profile = user.profile;
	const myProfile = me?.id === user.id;

	function copyProfileLink() {
		const link = window.location.href;
		copyText(link);
		toastSuccess(`Copied profile link for ${user.username}`);
	}

	function manageUser() {
		dispatch(
			openModal(<UserView userId={user.id} />, {
				width: 1200,
			})
		);
	}

	function reportProfile() {
		dispatch(openModal(<ReportUser user={user} />));
	}

	function editProfile() {
		dispatch(
			openModal(<EditProfile profile={profile} />, {
				title: 'Edit Profile',
			})
		);
	}

	return (
		<Dropdown
			noMargin
			icon="ph-caret-down-bold"
			dropdownButtonProps={{
				transparent: mini,
				small: mini,
				gray: false,
			}}
			options={[
				{text: 'View Profile', link: `/user/${user.username}`, icon: 'ph-user-bold'},
				{text: 'Copy Profile Link', onClick: copyProfileLink, icon: 'ph-copy-bold'},
				{text: 'Report', onClick: reportProfile, icon: 'ph-flag-bold', hidden: myProfile || !me},
				{text: 'Edit', onClick: editProfile, icon: 'ph-pen-bold', hidden: !myProfile},
				{text: 'Manage User', onClick: manageUser, icon: 'ph-gear-six-bold', hidden: !amAdmin},
			]}
			{...dropdownProps}
		/>
	);
}
